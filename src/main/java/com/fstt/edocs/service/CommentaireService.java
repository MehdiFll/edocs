package com.fstt.edocs.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fstt.edocs.model.Commentaire;
import com.fstt.edocs.repository.CommentaireRepository;

@Service
public class CommentaireService {
	
	@Autowired
	CommentaireRepository comrep;
	
	
	
	public List<Commentaire> getAllComments(){
		List<Commentaire> comms = new ArrayList<>();
		comrep.findAll().forEach(comms::add);
		return comms;
	}
	
	public Optional<Commentaire> getComment(long id) {
		return comrep.findById(id);
	}
	
	public void addComment(Commentaire comment) {
		comrep.save(comment);
	}
	
	public void updateComment(long id,Commentaire comment) {
		comrep.save(comment);
	}
	
	public void deleteComment(long id) {
	    comrep.deleteById(id);
	}
	
	
	
	

}
