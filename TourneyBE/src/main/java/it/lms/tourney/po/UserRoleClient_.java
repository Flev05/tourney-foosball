package it.lms.tourney.po;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(UserRoleClient.class)
public abstract class UserRoleClient_ {

	public static volatile SingularAttribute<UserRoleClient, Role> role;
	public static volatile SingularAttribute<UserRoleClient, Client> client;
	public static volatile SingularAttribute<UserRoleClient, Tourney> tourney;
	public static volatile SingularAttribute<UserRoleClient, Integer> id;
	public static volatile SingularAttribute<UserRoleClient, User> user;

}
