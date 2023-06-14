
package it.lms.tourney.po;

import javax.xml.bind.annotation.XmlRootElement;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@XmlRootElement
@Table(name = "discipline", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
@Getter
@Setter
public class Discipline extends AbstractPO {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name")
	private String name;

	public Discipline() {

	}

	@Override
	public String toString() {

		return super.toString() + " Discipline [name=" + name + "]";
	}
}
