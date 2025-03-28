package com.ssafy.memorybubble.common.config;

import com.ssafy.memorybubble.api.auth.security.handler.OAuth2FailureHandler;
import com.ssafy.memorybubble.api.auth.security.handler.OAuth2SuccessHandler;
import com.ssafy.memorybubble.api.auth.security.jwt.TokenAuthenticationFilter;
import com.ssafy.memorybubble.api.auth.security.jwt.TokenExceptionFilter;
import com.ssafy.memorybubble.api.auth.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@RequiredArgsConstructor
@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {
    private final CustomOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;
    private final TokenAuthenticationFilter tokenAuthenticationFilter;
    private final TokenExceptionFilter tokenExceptionFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // csrf 비활성화
                .cors(c->c.configurationSource(corsConfigurationSource)) // FrontEnd cors설정
                .httpBasic(AbstractHttpConfigurer::disable) // 기본 인증 로그인 비활성화
                .formLogin(AbstractHttpConfigurer::disable) // 기본 폼 로그인 비활성화
                .logout(AbstractHttpConfigurer::disable) // 기본 로그아웃 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용 x
                // request 인증, 인가 설정
                .authorizeHttpRequests(request ->
                        request.requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**")
                                .permitAll()
                                .requestMatchers("/api/auth/success", "/api/auth/login", "/api/auth/reissue")
                                .permitAll()
                                .requestMatchers("/actuator/health")
                                .permitAll()
                                .anyRequest().authenticated()
                )
                // oauth 설정
                .oauth2Login(oauth ->
                        oauth
                                .authorizationEndpoint(endpoint -> endpoint.baseUri("/api/auth/login"))
                                .userInfoEndpoint(c->c.userService(oAuth2UserService))
                                .successHandler(oAuth2SuccessHandler)
                                .failureHandler(oAuth2FailureHandler)
                )
                // 인증/권한 예외 처리 설정
                .exceptionHandling(handling -> handling
                        // 인증 X
                        .authenticationEntryPoint(((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"인증이 필요합니다.\"}");
                        }))
                        // 인증 O, 권한 X
                        .accessDeniedHandler(((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"접근 권한이 없습니다.\"}");
                        }))
                )
                // jwt 설정
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(tokenExceptionFilter, tokenAuthenticationFilter.getClass());

        return http.build();
    }

}
