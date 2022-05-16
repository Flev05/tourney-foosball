
package it.lms.tourney.po;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "session")
@Getter
@Setter
public class Session extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer           id;

    @Column(name = "user_session")
    private String            userSession;

    @Column(name = "user_info")
    private String            userInfo;

    @Column(name = "creation_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date              creationDate;

    // bi-directional many-to-one association to User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User              user;

    public Session() {

    }

    @Override
    public String toString() {

        return super.toString() + " Session [userSession=" + userSession + ", userInfo=" + userInfo + ", creationDate="
                + creationDate + ", user=" + user + "]";
    }
}
