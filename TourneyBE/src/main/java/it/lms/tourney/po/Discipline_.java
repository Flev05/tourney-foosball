package it.lms.tourney.po;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Discipline.class)
public abstract class Discipline_ {

	public static volatile SingularAttribute<Discipline, String> name;
	public static volatile SingularAttribute<Discipline, Integer> id;

}
