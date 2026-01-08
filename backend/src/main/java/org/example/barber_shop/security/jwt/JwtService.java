package org.example.barber_shop.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expirationMs
    ) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes()); // clé HMAC (HS256)
        this.expirationMs = expirationMs;
    }

    /** Génère un JWT signé avec sujet (email) et claims supplémentaires (ex: role, userId). */
    public String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expirationMs))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Extrait le "subject" (souvent l’email) du token. */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /** Vérifie signature + expiration + correspondance avec l’username attendu. */
    public boolean isTokenValid(String token, String expectedUsername) {
        String username = extractUsername(token);
        Date exp = extractClaim(token, Claims::getExpiration);
        return username != null && username.equals(expectedUsername) && exp.after(new Date());
    }

    /** Utilitaire générique pour lire un claim. Lève une exception si signature invalide. */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return resolver.apply(claims);
    }
}