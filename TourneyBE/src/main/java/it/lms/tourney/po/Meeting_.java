package it.lms.tourney.po;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Meeting.class)
public abstract class Meeting_ {

	public static volatile SingularAttribute<Meeting, Country> country;
	public static volatile SingularAttribute<Meeting, Integer> playoffId;
	public static volatile SingularAttribute<Meeting, Integer> playoutId;
	public static volatile SingularAttribute<Meeting, Integer> eliminatoryId;
	public static volatile SingularAttribute<Meeting, Integer> eliminatoryBId;
	public static volatile SingularAttribute<Meeting, String> json;
	public static volatile SingularAttribute<Meeting, Tourney> tourney;
	public static volatile SingularAttribute<Meeting, Integer> id;
	public static volatile SingularAttribute<Meeting, Integer> roundId;

}
