package com.phegondev.PhegonHotel.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    private String token;
    private String role;
    private String expirationTime;
    private String bookingConfirmationCode;

    private UserDTO user;
    private RoomDTO room;
    private BookingDTO booking;
    private List<UserDTO> userList;
    private List<RoomDTO> roomList;
    private List<BookingDTO> bookingList;

    // Lombok @Data is present, but add explicit getters/setters for robustness
    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getExpirationTime() { return expirationTime; }
    public void setExpirationTime(String expirationTime) { this.expirationTime = expirationTime; }
    public String getBookingConfirmationCode() { return bookingConfirmationCode; }
    public void setBookingConfirmationCode(String bookingConfirmationCode) { this.bookingConfirmationCode = bookingConfirmationCode; }
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    public RoomDTO getRoom() { return room; }
    public void setRoom(RoomDTO room) { this.room = room; }
    public BookingDTO getBooking() { return booking; }
    public void setBooking(BookingDTO booking) { this.booking = booking; }
    public java.util.List<UserDTO> getUserList() { return userList; }
    public void setUserList(java.util.List<UserDTO> userList) { this.userList = userList; }
    public java.util.List<RoomDTO> getRoomList() { return roomList; }
    public void setRoomList(java.util.List<RoomDTO> roomList) { this.roomList = roomList; }
    public java.util.List<BookingDTO> getBookingList() { return bookingList; }
    public void setBookingList(java.util.List<BookingDTO> bookingList) { this.bookingList = bookingList; }

}
