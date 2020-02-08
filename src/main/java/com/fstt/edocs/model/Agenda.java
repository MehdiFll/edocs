package com.fstt.edocs.model;

import java.util.Date;

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
public class Agenda {

	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long Id;
	
	@NotBlank
	private String title;
	
	private Date end;
	
	private Date start;
		
	@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,property = "id")
	@JsonIdentityReference(alwaysAsId = true)
	@ManyToOne()
	@JoinColumn(name = "user_id")
	private User user;
	
	public Agenda () {
		
	}

	

	public Agenda(String title, Date start, Date end, User user) {
		super();
		this.title = title;
		this.start = start;
		this.end = end;

		this.user = user;
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



	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Date getStart() {
		return start;
	}

	public void setStart(Date start) {
		this.start = start;
	}

	public Date getend() {
		return end;
	}

	public void setEnd(Date end) {
		this.end = end;
	}

	
	
}


