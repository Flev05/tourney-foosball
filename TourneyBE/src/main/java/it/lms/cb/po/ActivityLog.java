
package it.lms.cb.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 * The persistent class for the tbl_user_roles database table.
 * 
 */
@Entity
@Table(name = "activity_log")
@NamedQueries({
        @NamedQuery(name = "User.deleteByUser", query = "delete from ActivityLog as al where al.user = :user") })
public class ActivityLog extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String            type;
    private String            statement;
    private Timestamp         creationDate;

    private User              user;

    public ActivityLog() {

        creationDate = new Timestamp(new Date().getTime());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer getId() {

        return super.getId();
    }

    public void setId(Integer id) {

        super.setId(id);
    }

    @Column(name = "type")
    public String getType() {

        return type;
    }

    public void setType(String type) {

        this.type = type;
    }

    @Column(name = "statement")
    public String getStatement() {

        return statement;
    }

    public void setStatement(String statement) {

        this.statement = statement;
    }

    @Column(name = "creation_date")
    public Timestamp getCreationDate() {

        return creationDate;
    }

    public void setCreationDate(Timestamp creationDate) {

        this.creationDate = creationDate;
    }

    // bi-directional many-to-one association to UserTable
    @ManyToOne
    @JoinColumn(name = "user_id")
    public User getUser() {

        return this.user;
    }

    public void setUser(User user) {

        this.user = user;
    }

}