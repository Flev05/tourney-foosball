
package it.lms.tourney.po;

import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Meeting.class)
public class Meeting_ {

    public static volatile SingularAttribute<Meeting, Integer> playoffId;
    public static volatile SingularAttribute<Meeting, Integer> eliminatoryId;
    public static volatile SingularAttribute<Meeting, String>  json;
    public static volatile SingularAttribute<Meeting, Tourney> tourney;
    public static volatile SingularAttribute<Meeting, Integer> id;
    public static volatile SingularAttribute<Meeting, Integer> roundId;

}
