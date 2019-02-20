
package it.lms.tourney.po;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Client.class)
public abstract class Client_ {

    public static volatile SingularAttribute<Client, Country>   country;
    public static volatile SingularAttribute<Client, String>    address;
    public static volatile SingularAttribute<Client, String>    phoneNumber;
    public static volatile SingularAttribute<Client, String>    siteUrl;
    public static volatile SingularAttribute<Client, String>    businessName;
    public static volatile SingularAttribute<Client, Integer>   id;
    public static volatile SingularAttribute<Client, String>    email;

    public static volatile SetAttribute<Client, UserRoleClient> urcSet;
}
