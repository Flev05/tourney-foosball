
package it.lms.tourney.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Getter;
import lombok.Setter;

@Entity
@XmlRootElement
@Table(name = "discipline", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
@Getter
@Setter
public class Discipline extends AbstractPO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer           id;

    @Column(name = "name")
    private String            name;

    public Discipline() {

    }

    @Override
    public String toString() {

        return super.toString() + " Discipline [name=" + name + "]";
    }
}
