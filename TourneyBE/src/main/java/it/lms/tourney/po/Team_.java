package it.lms.tourney.po;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Team.class)
public abstract class Team_ {

	public static volatile SingularAttribute<Team, String> teamName;
	public static volatile SingularAttribute<Team, Country> country;
	public static volatile SingularAttribute<Team, Session> session;
	public static volatile SingularAttribute<Team, String> json;
	public static volatile SingularAttribute<Team, Client> client;
	public static volatile SingularAttribute<Team, Integer> id;

}
