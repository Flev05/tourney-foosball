
package it.lms.cb.jpa;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.stream.Stream;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import lombok.Getter;

public class Generator {

    @Getter
    private enum EDbType {

        POSTGRES_TOURNEY("TourneyPU-GEN");

        private String value;

        private EDbType(String value) {

            this.value = value;
        }
    }

    public static void main(String[] args) {

        // createSchema(EDbType.ORACLE);
        // createSchema(EDbType.MYSQL);
        // createSchema(EDbType.POSTGRES_UM);
        createSchema(EDbType.POSTGRES_TOURNEY);
    }

    private static void createSchema(final EDbType dbType) {

        Stream.of(new File("generated").listFiles((file) -> {
            return file.getName().startsWith("db-schema." + dbType.name().toLowerCase());
        })).forEach(f -> {
            try {
                Files.deleteIfExists(Paths.get(f.toURI()));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        EntityManagerFactory factory = null;
        try {
            System.out.println("Trying to generate DDL...");
            factory = Persistence.createEntityManagerFactory(dbType.getValue(), getSchemaProperties(dbType));
            factory.createEntityManager().close();
            System.out.println("DDL generated");
        } finally {
            if (factory != null) factory.close();
        }
    }

    private static Properties getSchemaProperties(final EDbType dbType) {

        Properties props = new Properties();

        switch (dbType) {
            case POSTGRES_TOURNEY:
                props.setProperty("javax.persistence.jdbc.url", "jdbc:postgresql://localhost:5432/tourneydbtest");
                props.setProperty("javax.persistence.jdbc.user", "tourney");
                props.setProperty("javax.persistence.jdbc.password", "tourney");
                props.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQL95Dialect");
                break;
            default:
                break;
        }

        props.setProperty("javax.persistence.schema-generation.scripts.action", "drop-and-create");
        props.setProperty("javax.persistence.schema-generation.scripts.create-target",
                "generated/db-schema." + dbType.name().toLowerCase() + ".create.ddl");
        props.setProperty("javax.persistence.schema-generation.scripts.drop-target",
                "generated/db-schema." + dbType.name().toLowerCase() + ".drop.ddl");

        return props;
    }
}
