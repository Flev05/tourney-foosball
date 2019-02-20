
package it.lms.tourney.po;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ {

    public static volatile SingularAttribute<User, Country>   country;
    public static volatile SingularAttribute<User, String>    password;
    public static volatile SingularAttribute<User, String>    firstname;
    public static volatile SingularAttribute<User, String>    address;
    public static volatile SingularAttribute<User, String>    phoneNumber;
    public static volatile SingularAttribute<User, Integer>   id;
    public static volatile SingularAttribute<User, String>    email;
    public static volatile SingularAttribute<User, String>    username;
    public static volatile SingularAttribute<User, String>    lastname;

    public static volatile SetAttribute<User, UserRoleClient> urcSet;
}
