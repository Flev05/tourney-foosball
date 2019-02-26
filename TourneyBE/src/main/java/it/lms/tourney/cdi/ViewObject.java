
package it.lms.tourney.cdi;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import javax.inject.Qualifier;

@Qualifier
@Retention(RetentionPolicy.RUNTIME)
// @Target({ Target.METHOD, Target.FIELD, Target.PARAMETER, Target.TYPE })
public @interface ViewObject {

}
