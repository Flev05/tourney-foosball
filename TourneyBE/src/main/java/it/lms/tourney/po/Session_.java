package it.lms.tourney.po;

import java.util.Date;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Session.class)
public abstract class Session_ {

	public static volatile SingularAttribute<Session, String> userInfo;
	public static volatile SingularAttribute<Session, String> userSession;
	public static volatile SingularAttribute<Session, Integer> id;
	public static volatile SingularAttribute<Session, Date> creationDate;
	public static volatile SingularAttribute<Session, User> user;

}
