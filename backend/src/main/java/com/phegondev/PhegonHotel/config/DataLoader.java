package com.phegondev.PhegonHotel.config;

import com.phegondev.PhegonHotel.entity.Room;
import com.phegondev.PhegonHotel.entity.User;
import com.phegondev.PhegonHotel.repo.RoomRepository;
import com.phegondev.PhegonHotel.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
@Profile("local") // Only run this for local profile (H2 database)
public class DataLoader {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, RoomRepository roomRepository) {
        return args -> {
            // Check if data already exists
            if (userRepository.count() == 0) {
                // Create admin user
                User admin = new User();
                admin.setEmail("admin@sitara.com");
                admin.setName("Admin User");
                admin.setPhoneNumber("1234567890");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);

                // Create regular user
                User user = new User();
                user.setEmail("user@sitara.com");
                user.setName("Test User");
                user.setPhoneNumber("9876543210");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setRole("USER");
                userRepository.save(user);

                System.out.println("✅ Sample users created:");
                System.out.println("   Admin - Email: admin@sitara.com, Password: admin123");
                System.out.println("   User  - Email: user@sitara.com, Password: user123");
            }

            // Create sample rooms if none exist
            if (roomRepository.count() == 0) {
                Room room1 = new Room();
                room1.setRoomType("Deluxe Suite");
                room1.setRoomPrice(new BigDecimal("150.00"));
                room1.setRoomDescription("Spacious deluxe suite with king-size bed and ocean view");
                room1.setRoomPhotoUrl("https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800");
                roomRepository.save(room1);

                Room room2 = new Room();
                room2.setRoomType("Standard Room");
                room2.setRoomPrice(new BigDecimal("80.00"));
                room2.setRoomDescription("Comfortable standard room with queen-size bed");
                room2.setRoomPhotoUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800");
                roomRepository.save(room2);

                Room room3 = new Room();
                room3.setRoomType("Executive Suite");
                room3.setRoomPrice(new BigDecimal("250.00"));
                room3.setRoomDescription("Luxury executive suite with living area and city view");
                room3.setRoomPhotoUrl("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800");
                roomRepository.save(room3);

                Room room4 = new Room();
                room4.setRoomType("Family Room");
                room4.setRoomPrice(new BigDecimal("120.00"));
                room4.setRoomDescription("Large family room with two queen beds");
                room4.setRoomPhotoUrl("https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800");
                roomRepository.save(room4);

                System.out.println("✅ Sample rooms created: 4 rooms added");
            }
        };
    }
}

