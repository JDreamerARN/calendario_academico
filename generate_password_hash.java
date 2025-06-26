import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "123456";
        String encodedPassword = encoder.encode(password);
        System.out.println("Senha original: " + password);
        System.out.println("Hash BCrypt: " + encodedPassword);
        
        // Verificar se o hash está correto
        boolean matches = encoder.matches(password, encodedPassword);
        System.out.println("Hash válido: " + matches);
    }
} 