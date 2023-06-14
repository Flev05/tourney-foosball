package it.lms.tourney.po;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Player.class)
public abstract class Player_ {

	public static volatile SingularAttribute<Player, Country> country;
	public static volatile SingularAttribute<Player, String> playerName;
	public static volatile SingularAttribute<Player, Session> session;
	public static volatile SingularAttribute<Player, Client> client;
	public static volatile SingularAttribute<Player, String> json;
	public static volatile SingularAttribute<Player, Integer> id;

}
