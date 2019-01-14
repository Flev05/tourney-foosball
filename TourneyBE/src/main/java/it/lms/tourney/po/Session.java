
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

/**
 * The persistent class for the user database table.
 */
@Entity
@Table(name = "session")
public class Session extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            userSession;
    private String            userInfo;
    private Date              creationDate;

    private User              user;

    public Session() {

    }

    @Override
    public String toString() {

        return super.toString() + " Session [userSession=" + userSession + ", userInfo=" + userInfo + ", creationDate="
                + creationDate + ", user=" + user + "]";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "user_session")
    public String getUserSession() {

        return userSession;
    }

    public void setUserSession(String userSession) {

        this.userSession = userSession;
    }

    @Column(name = "user_info")
    public String getUserInfo() {

        return userInfo;
    }

    public void setUserInfo(String userInfo) {

        this.userInfo = userInfo;
    }

    @Column(name = "creation_date")
    @Temporal(TemporalType.TIMESTAMP)
    public Date getCreationDate() {

        return creationDate;
    }

    public void setCreationDate(Date creationDate) {

        this.creationDate = creationDate;
    }

    // bi-directional many-to-one association to User
    @ManyToOne
    @JoinColumn(name = "user_id")
    public User getUser() {

        return user;
    }

    public void setUser(User user) {

        this.user = user;
    }
}
