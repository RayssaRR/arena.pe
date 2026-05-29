package com.ffqts.arenape.services;

import com.ffqts.arenape.controllers.dto.statistics.EventStatisticsDTO;
import com.ffqts.arenape.controllers.dto.statistics.TicketSalesPeriodDTO;
import com.ffqts.arenape.controllers.dto.statistics.WeeklySalesDTO;
import com.ffqts.arenape.models.ticket.TicketModel;
import com.ffqts.arenape.models.ticket.UserTicket;
import com.ffqts.arenape.repositories.EventRepository;
import com.ffqts.arenape.repositories.TicketModelRepository;
import com.ffqts.arenape.repositories.UserTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventStatisticsService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TicketModelRepository ticketModelRepository;

    @Autowired
    private UserTicketRepository userTicketRepository;

    public EventStatisticsDTO getEventStatistics(UUID eventId) {
        eventRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        List<TicketModel> ticketModels = ticketModelRepository.findByEvent_Id(eventId);

        int totalTicketsAvailable = ticketModels.stream()
            .mapToInt(TicketModel::getTicketsAvailable)
            .sum();

        List<UserTicket> soldTickets = userTicketRepository.findByEvent_Id(eventId);

        double totalRevenue = soldTickets.stream()
            .mapToDouble(ticket -> ticket.getTicketModel().getPrice())
            .sum();

        int ticketsSold = soldTickets.size();

        double averageTicketPrice = ticketModels.isEmpty() ? 0.0 : ticketModels.stream()
            .mapToDouble(TicketModel::getPrice)
            .average()
            .orElse(0.0);

        List<WeeklySalesDTO> salesByPeriod = calculateSalesByPeriod(soldTickets);

        return new EventStatisticsDTO(
            totalRevenue,
            ticketsSold,
            totalTicketsAvailable,
            averageTicketPrice,
            salesByPeriod
        );
    }

    private List<WeeklySalesDTO> calculateSalesByPeriod(List<UserTicket> soldTickets) {
        List<WeeklySalesDTO> weeks = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int weekOffset = 3; weekOffset >= 0; weekOffset--) {
            LocalDateTime weekStart = now.minusWeeks(weekOffset).truncatedTo(ChronoUnit.DAYS).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime weekEnd = weekStart.plusDays(7);

            List<UserTicket> weekTickets = soldTickets.stream()
                .filter(ticket -> ticket.getCreatedAt().isAfter(weekStart) && ticket.getCreatedAt().isBefore(weekEnd))
                .collect(Collectors.toList());

            int weekTicketCount = weekTickets.size();
            double weekRevenue = weekTickets.stream()
                .mapToDouble(ticket -> ticket.getTicketModel().getPrice())
                .sum();

            List<TicketSalesPeriodDTO> dailyBreakdown = calculateDailyBreakdownForWeek(weekTickets, weekStart);

            String weekPeriod = String.format("Semana de %s", weekStart.toLocalDate());
            weeks.add(new WeeklySalesDTO(weekPeriod, weekTicketCount, weekRevenue, dailyBreakdown));
        }

        return weeks;
    }

    private List<TicketSalesPeriodDTO> calculateDailyBreakdownForWeek(List<UserTicket> weekTickets, LocalDateTime weekStart) {
        List<TicketSalesPeriodDTO> dailyBreakdown = new ArrayList<>();

        for (int dayOffset = 0; dayOffset < 7; dayOffset++) {
            LocalDateTime dayStart = weekStart.plusDays(dayOffset);
            LocalDateTime dayEnd = dayStart.plusDays(1);

            List<UserTicket> dayTickets = weekTickets.stream()
                .filter(ticket -> ticket.getCreatedAt().isAfter(dayStart) && ticket.getCreatedAt().isBefore(dayEnd))
                .collect(Collectors.toList());

            int ticketCount = dayTickets.size();
            double revenue = dayTickets.stream()
                .mapToDouble(ticket -> ticket.getTicketModel().getPrice())
                .sum();

            String period = String.format("Dia %s", dayStart.toLocalDate());
            dailyBreakdown.add(new TicketSalesPeriodDTO(period, ticketCount, revenue));
        }

        return dailyBreakdown;
    }
}
