package it.lms.tourney.po;

import jakarta.persistence.metamodel.SetAttribute;
import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Role.class)
public abstract class Role_ {

	public static volatile SetAttribute<Role, UserRoleClient> urcSet;
	public static volatile SingularAttribute<Role, String> name;
	public static volatile SingularAttribute<Role, String> description;
	public static volatile SingularAttribute<Role, Integer> id;

}
