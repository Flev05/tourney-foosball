package it.lms.tourney.po;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Client.class)
public abstract class Client_ {

	public static volatile SingularAttribute<Client, Country> country;
	public static volatile SingularAttribute<Client, String> address;
	public static volatile SingularAttribute<Client, String> phoneNumber;
	public static volatile SingularAttribute<Client, String> siteUrl;
	public static volatile SetAttribute<Client, UserRoleClient> urcSet;
	public static volatile SingularAttribute<Client, String> businessName;
	public static volatile SingularAttribute<Client, Integer> id;
	public static volatile SingularAttribute<Client, String> email;

}
