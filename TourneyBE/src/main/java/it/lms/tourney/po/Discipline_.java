package it.lms.tourney.po;

import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Discipline.class)
public abstract class Discipline_ {

	public static volatile SingularAttribute<Discipline, String> name;
	public static volatile SingularAttribute<Discipline, Integer> id;

}
