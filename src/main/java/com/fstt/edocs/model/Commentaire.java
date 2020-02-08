package com.fstt.edocs.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
public class Commentaire {
	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long Id;
	
	@NotBlank
	private String contenu;
	

	@ManyToOne
	@JoinColumn(name="user_id")
	 private User user;
	 
	@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "titre")
	@JsonIdentityReference(alwaysAsId = true)
	@ManyToOne
	@JoinColumn(name="sujet_id")
	 private Sujet sujet;
	
	@NotBlank
	private String date;
	
	
	public Commentaire(@NotBlank String contenu, User user, Sujet sujet, @NotBlank String date) {
		super();
		this.contenu = contenu;
		this.user = user;
		this.sujet = sujet;
		this.date = date;
	}
	public Commentaire() {
		 
	 }
	public String getContenu() {
		return contenu;
	}


	public void setContenu(String contenu) {
		this.contenu = contenu;
	}
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public Sujet getSujet() {
		return sujet;
	}
	public void setSujet(Sujet sujet) {
		this.sujet = sujet;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public Long getId() {
		return Id;
	}
	public void setId(Long id) {
		Id = id;
	}

	 
	 
	
	
	
	

}
