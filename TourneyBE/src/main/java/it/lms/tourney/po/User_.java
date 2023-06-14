package it.lms.tourney.po;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(User.class)
public abstract class User_ {

	public static volatile SingularAttribute<User, Country> country;
	public static volatile SingularAttribute<User, String> password;
	public static volatile SingularAttribute<User, String> firstname;
	public static volatile SingularAttribute<User, String> address;
	public static volatile SingularAttribute<User, String> phoneNumber;
	public static volatile SetAttribute<User, UserRoleClient> urcSet;
	public static volatile SingularAttribute<User, String> description;
	public static volatile SingularAttribute<User, Integer> id;
	public static volatile SingularAttribute<User, String> email;
	public static volatile SingularAttribute<User, String> username;
	public static volatile SingularAttribute<User, String> lastname;

}
