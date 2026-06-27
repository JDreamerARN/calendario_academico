package com.eventosacademicos.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaMigration {

    private static final Logger logger = LoggerFactory.getLogger(SchemaMigration.class);

    private final JdbcTemplate jdbcTemplate;

    public SchemaMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void migrateLegacyColumns() {
        dropColumnIfExists("users", "approved");
        dropColumnIfExists("users", "user_type");
        dropColumnIfExists("users", "registration_number");
        dropColumnIfExists("events", "event_type");
    }

    private void dropColumnIfExists(String table, String column) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class,
                table,
                column
        );

        if (count != null && count > 0) {
            logger.info("Removendo coluna legada {}.{}", table, column);
            jdbcTemplate.execute("ALTER TABLE `" + table + "` DROP COLUMN `" + column + "`");
        }
    }
}
