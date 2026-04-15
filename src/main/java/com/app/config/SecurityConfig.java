package com.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 1. Disable CSRF for JWT/Stateless APIs
            .csrf(csrf -> csrf.disable())

            // 2. Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Configure Endpoint Permissions
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2-console/**").permitAll() // Keep H2 access
                .requestMatchers("/auth/**").permitAll()       // Permit login/register
                .requestMatchers("/api/quantities/**").permitAll()  // Allow non-versioned quantity endpoints
                .requestMatchers("/api/v1/quantities/history/**").permitAll()  // Allow versioned history access
                .requestMatchers("/api/v1/quantities/**").permitAll()  // Allow all versioned quantity endpoints
                .anyRequest().authenticated()                  // Protect all other APIs
            )

            // 4. Enable OAuth2 Login (Commented out - configure OAuth2 credentials to enable)
            // .oauth2Login(oauth->oauth.defaultSuccessUrl("/oauth/success",true))

            // 5. Handle H2 Frames (Needed to see the H2 UI in browser)
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))

            // 6. Session Management (Set to stateless if strictly using JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    // CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // BCrypt Password Encoder for Local User Auth
   
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}