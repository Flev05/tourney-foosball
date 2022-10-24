package it.lms.tourney.po;

import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(Country.class)
public abstract class Country_ {

	public static volatile SingularAttribute<Country, String> zipCode;
	public static volatile SingularAttribute<Country, String> city;
	public static volatile SingularAttribute<Country, String> cityCode;
	public static volatile SingularAttribute<Country, String> provinceCode;
	public static volatile SingularAttribute<Country, String> countryCode;
	public static volatile SingularAttribute<Country, Integer> id;

}
