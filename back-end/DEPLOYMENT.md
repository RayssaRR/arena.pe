# 🚀 Guia de Deployment na AWS EC2

## Pré-requisitos na EC2

1. **Instalar Docker:**
```bash
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user
```

2. **Instalar Docker Compose:**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

3. **Configurar Git (opcional, para clonar o repositório):**
```bash
sudo yum install git -y
```

## 📦 Deployment

### 1. Clone o repositório na EC2
```bash
cd /home/ec2-user
git clone <seu-repositorio> arena.pe
cd arena.pe/back-end
```

### 2. Configure as variáveis de ambiente (opcional)
Se quiser alterar as credenciais do banco, edite o `docker-compose.yml`:
```bash
nano docker-compose.yml
```

### 3. Build e inicie os containers
```bash
docker-compose up -d
```

### 4. Verifique o status
```bash
docker-compose ps
docker logs arena_backend
docker logs arena_postgres
```

## 🔧 Configurações Importantes

### Portas Abertas
- **Backend:** 8080 (configure Security Group da EC2)
- **PostgreSQL:** 5432 (apenas acesso interno, não exponha)

### AWS Security Group
Adicione estas regras de entrada:
- Port 8080 from 0.0.0.0/0 (HTTP para o backend)
- Port 443 from 0.0.0.0/0 (HTTPS, se usando reverse proxy)

### Volumes Persistentes
- `postgres_data` → dados do banco (persiste entre reinicializações)
- `uploads_data` → arquivos de upload

## 🛑 Comandos Úteis

```bash
# Ver logs
docker-compose logs -f backend

# Parar tudo
docker-compose down

# Reiniciar
docker-compose restart

# Limpar volumes (⚠️ apaga dados!)
docker-compose down -v
```

## 🔐 Para Produção

1. **Altere as senhas do PostgreSQL** em `docker-compose.yml`
2. **Considere usar volumes de rede** (EBS) em vez de volumes locais
3. **Configure um reverse proxy** (Nginx) na frente da aplicação
4. **Use AWS RDS** em vez de PostgreSQL em container (recomendado para produção)
5. **Configure backup automático** do banco de dados

## 🌐 Conectar Frontend (Vercel)

Na Vercel, configure a variável de ambiente:
```
NEXT_PUBLIC_API_URL=http://seu-ip-ec2:8080
```

Ou melhor, use um domínio com Elastic IP + Route 53.
