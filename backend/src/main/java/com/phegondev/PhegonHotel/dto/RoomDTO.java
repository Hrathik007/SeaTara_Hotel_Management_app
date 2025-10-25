package com.phegondev.PhegonHotel.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomDTO {

    private Long id;
    private String roomType;
    private BigDecimal roomPrice;
    private String roomPhotoUrl;
    private String roomDescription;
    private List<BookingDTO> bookings;

    // Explicit getters and setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public java.math.BigDecimal getRoomPrice() { return roomPrice; }
    public void setRoomPrice(java.math.BigDecimal roomPrice) { this.roomPrice = roomPrice; }
    public String getRoomPhotoUrl() { return roomPhotoUrl; }
    public void setRoomPhotoUrl(String roomPhotoUrl) { this.roomPhotoUrl = roomPhotoUrl; }
    public String getRoomDescription() { return roomDescription; }
    public void setRoomDescription(String roomDescription) { this.roomDescription = roomDescription; }
    public java.util.List<com.phegondev.PhegonHotel.dto.BookingDTO> getBookings() { return bookings; }
    public void setBookings(java.util.List<com.phegondev.PhegonHotel.dto.BookingDTO> bookings) { this.bookings = bookings; }
}
