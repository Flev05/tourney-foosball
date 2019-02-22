
package it.lms.tourney.po;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Role.class)
public class Role_ {

    public static volatile SingularAttribute<Role, String>    name;
    public static volatile SingularAttribute<Role, String>    description;
    public static volatile SingularAttribute<Role, Integer>   id;
    public static volatile SetAttribute<Role, UserRoleClient> urcSet;
}
