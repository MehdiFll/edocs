package com.fstt.edocs.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;


@Entity
public class Document {
	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long Id;
	
	@NotBlank
	private String nom;
	
	@NotBlank
	private String categorie;
	
	@NotBlank
	@Column(columnDefinition = "TEXT")
	private String description;
	
	private Date date;

	
	@Lob
	private byte[] contenu;
	
	@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
	@JsonIdentityReference(alwaysAsId = true)
	@ManyToOne()
	@JoinColumn(name = "user_id")
	private User user;

	@NotBlank
	@Column(columnDefinition = "TEXT")
	private String type;
	
	@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
	@JsonIdentityReference(alwaysAsId = true)
	@OneToMany()
	@JoinColumn(name="document_id")
	private Set<Telechargement> telechargements;
	
	
	public Document() {
		
	}
	
	
	
	public Document(String nom, String description, String categorie, String type,byte[] contenu, User user) {
		super();
		this.nom = nom;
		this.description = description;
		this.contenu = contenu;
		SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		try {
			this.date=sf.parse(sf.format(new Date()));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.user = user;
		this.categorie=categorie;
		this.type=type;
	}
	
	
	
	public Date getDate() {
		return date;
	}



	public void setDate(Date date) {
		this.date = date;
	}



	public Set<Telechargement> getTelechargements() {
		return telechargements;
	}



	public String getCategorie() {
		return categorie;
	}



	public void setCategorie(String categorie) {
		this.categorie = categorie;
	}



	public void setTelechargements(Set<Telechargement> telechargements) {
		this.telechargements = telechargements;
	}



	public String getType() {
		return type;
	}



	public void setType(String type) {
		this.type = type;
	}



	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public byte[] getContenu() {
		return contenu;
	}

	public void setContenu(byte[] contenu) {
		this.contenu = contenu;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}



	public Long getId() {
		return Id;
	}



	public void setId(Long id) {
		Id = id;
	}
	
	
	
	
}
