package it.lms.tourney.po;

import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Tourney.class)
public abstract class Tourney_ {

	public static volatile SingularAttribute<Tourney, Country> country;
	public static volatile SingularAttribute<Tourney, Session> session;
	public static volatile SingularAttribute<Tourney, Client> client;
	public static volatile SingularAttribute<Tourney, String> json;
	public static volatile SetAttribute<Tourney, Meeting> meetings;
	public static volatile SingularAttribute<Tourney, Integer> id;
	public static volatile SingularAttribute<Tourney, Discipline> discipline;
	public static volatile SetAttribute<Tourney, UserRoleClient> urcs;
	public static volatile SingularAttribute<Tourney, String> tourneyName;

}
