package com.fstt.edocs.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.NaturalId;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
            "username"
        }),
        @UniqueConstraint(columnNames = {
            "email"
        })
})
public class User{
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long Id;
	
    @NotBlank
    @Size(min=3, max = 50)
    private String nom;

    
    @NotBlank
    @Size(min=3, max = 50)
    private String prenom;
    @NotBlank
    @Size(min=3, max = 50)
    private String username;

    @NaturalId
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min=6, max = 100)
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", 
    	joinColumns = @JoinColumn(name = "user_id"), 
    	inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
    
    
    @OneToMany()
	@JoinColumn(name="user_id")
	private Set<Telechargement> telechargements;
    
    @OneToMany()
	@JoinColumn(name="user_id")
	private Set<Agenda> agendas;
    
    @JsonIgnore
	@OneToMany
	@JoinColumn(name="user_id")
	private Set<Sujet> sujets;
	
	@JsonIgnore
	@OneToMany
	@JoinColumn(name="user_id")
	private Set<Commentaire> commentaires;
	
    public Set<Agenda> getAgendas() {
		return agendas;
	}






	public void setAgendas(Set<Agenda> agendas) {
		this.agendas = agendas;
	}






	public Set<Telechargement> getTelechargements() {
		return telechargements;
	}






	public void setTelechargements(Set<Telechargement> telechargements) {
		this.telechargements = telechargements;
	}






	public Set<Document> getDocument() {
		return document;
	}






	public void setDocument(Set<Document> document) {
		this.document = document;
	}
	@JsonIgnore
	@OneToMany
	@JoinColumn(name="user_id")
	private Set<Document> document;

    public User() {}



	public Set<Sujet> getSujets() {
		return sujets;
	}



	public void setSujets(Set<Sujet> sujets) {
		this.sujets = sujets;
	}



	public Set<Commentaire> getCommentaires() {
		return commentaires;
	}



	public void setCommentaires(Set<Commentaire> commentaires) {
		this.commentaires = commentaires;
	}



	public User(@NotBlank @Size(min = 3, max = 50) String nom, @NotBlank @Size(min = 3, max = 50) String prenom,
			@NotBlank @Size(min = 3, max = 50) String username, @NotBlank @Size(max = 50) @Email String email,
			@NotBlank @Size(min = 6, max = 100) String password) {
		super();
		this.nom = nom;
		this.prenom = prenom;
		this.username = username;
		this.email = email;
		this.password = password;
	}



	

    public Long getId() {
		return Id;
	}






	public void setId(Long id) {
		Id = id;
	}






	public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    
    public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}