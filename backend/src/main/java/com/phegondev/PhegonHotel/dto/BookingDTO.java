package com.phegondev.PhegonHotel.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingDTO {

    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numOfAdults;
    private int numOfChildren;
    private int totalNumOfGuest;
    private String bookingConfirmationCode;
    private UserDTO user;
    private RoomDTO room;

    // Explicit getters and setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public java.time.LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(java.time.LocalDate checkInDate) { this.checkInDate = checkInDate; }
    public java.time.LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(java.time.LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
    public int getNumOfAdults() { return numOfAdults; }
    public void setNumOfAdults(int numOfAdults) { this.numOfAdults = numOfAdults; }
    public int getNumOfChildren() { return numOfChildren; }
    public void setNumOfChildren(int numOfChildren) { this.numOfChildren = numOfChildren; }
    public int getTotalNumOfGuest() { return totalNumOfGuest; }
    public void setTotalNumOfGuest(int totalNumOfGuest) { this.totalNumOfGuest = totalNumOfGuest; }
    public String getBookingConfirmationCode() { return bookingConfirmationCode; }
    public void setBookingConfirmationCode(String bookingConfirmationCode) { this.bookingConfirmationCode = bookingConfirmationCode; }
    public com.phegondev.PhegonHotel.dto.UserDTO getUser() { return user; }
    public void setUser(com.phegondev.PhegonHotel.dto.UserDTO user) { this.user = user; }
    public com.phegondev.PhegonHotel.dto.RoomDTO getRoom() { return room; }
    public void setRoom(com.phegondev.PhegonHotel.dto.RoomDTO room) { this.room = room; }
}
