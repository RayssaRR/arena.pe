package com.ffqts.arenape.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/uploads")
public class UploadController {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    );

    private final Path uploadDirectory;

    public UploadController(@Value("${app.upload-dir:/app/uploads}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(@RequestPart("file") MultipartFile file)
        throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Arquivo nao enviado."));
        }

        if (file.getContentType() == null || !ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tipo de arquivo nao permitido."));
        }

        Files.createDirectories(uploadDirectory);

        String filename = buildFilename(file);
        Path targetPath = uploadDirectory.resolve(filename).normalize();

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        return ResponseEntity
            .status(201)
            .body(Map.of(
                "filename", filename,
                "path", "/uploads/" + filename
            ));
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        Path filePath = uploadDirectory.resolve(filename).normalize();

        if (!filePath.startsWith(uploadDirectory) || !Files.exists(filePath) || !Files.isRegularFile(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(filePath.toUri());
        String contentType = Files.probeContentType(filePath);

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok();
        if (contentType != null && !contentType.isBlank()) {
            responseBuilder.contentType(MediaType.parseMediaType(contentType));
        }

        return responseBuilder
            .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
            .body(resource);
    }

    private String buildFilename(MultipartFile file) {
        String extension = resolveExtension(file);
        return UUID.randomUUID() + extension;
    }

    private String resolveExtension(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        if (originalName != null) {
            String sanitized = originalName.trim().toLowerCase();
            int lastDotIndex = sanitized.lastIndexOf('.');
            if (lastDotIndex >= 0 && lastDotIndex < sanitized.length() - 1) {
                return sanitized.substring(lastDotIndex);
            }
        }

        String contentType = file.getContentType();
        if ("image/jpeg".equals(contentType)) {
            return ".jpg";
        }
        if ("image/png".equals(contentType)) {
            return ".png";
        }
        if ("image/webp".equals(contentType)) {
            return ".webp";
        }
        if ("image/gif".equals(contentType)) {
            return ".gif";
        }

        return ".bin";
    }
}