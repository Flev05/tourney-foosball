package it.lms.tourney.po;

import java.util.Date;

import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Session.class)
public abstract class Session_ {

	public static volatile SingularAttribute<Session, String> userInfo;
	public static volatile SingularAttribute<Session, String> userSession;
	public static volatile SingularAttribute<Session, Integer> id;
	public static volatile SingularAttribute<Session, Date> creationDate;
	public static volatile SingularAttribute<Session, User> user;

}
