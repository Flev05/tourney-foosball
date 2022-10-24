package it.lms.tourney.po;

import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(UserRoleClient.class)
public abstract class UserRoleClient_ {

	public static volatile SingularAttribute<UserRoleClient, Role> role;
	public static volatile SingularAttribute<UserRoleClient, Boolean> available;
	public static volatile SingularAttribute<UserRoleClient, Client> client;
	public static volatile SingularAttribute<UserRoleClient, Tourney> tourney;
	public static volatile SingularAttribute<UserRoleClient, Integer> id;
	public static volatile SingularAttribute<UserRoleClient, User> user;

}
