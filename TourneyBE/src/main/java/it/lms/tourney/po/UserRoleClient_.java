
package it.lms.tourney.po;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(UserRoleClient.class)
public abstract class UserRoleClient_ {

    public static volatile SingularAttribute<UserRoleClient, Integer> id;

    public static volatile SingularAttribute<UserRoleClient, User>    user;
    public static volatile SingularAttribute<UserRoleClient, Role>    role;
    public static volatile SingularAttribute<UserRoleClient, Client>  client;
}
