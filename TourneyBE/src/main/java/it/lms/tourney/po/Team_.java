
package it.lms.tourney.po;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Team.class)
public class Team_ {

    public static volatile SingularAttribute<Team, Integer> id;
    public static volatile SingularAttribute<Team, Session> session;
    public static volatile SingularAttribute<Team, String>  json;
    public static volatile SingularAttribute<Team, String>  teamName;
    public static volatile SingularAttribute<Team, Client>  client;
    public static volatile SingularAttribute<Team, Country> country;
}
