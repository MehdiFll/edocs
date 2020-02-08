package com.fstt.edocs.controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fstt.edocs.model.Commentaire;
import com.fstt.edocs.model.Sujet;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.UserRepository;
import com.fstt.edocs.service.CommentaireService;
import com.fstt.edocs.service.SujetService;



@RestController
public class SujetController {

	@Autowired
	SujetService sujetService;
	
	@Autowired
	UserRepository userep;
	
	@Autowired
	CommentaireService comservice;
	
	@GetMapping("/api/sujet")
	public List<Sujet> allsubjects(){
		return sujetService.getAllSubjects();
		
	}
	
	@GetMapping("/api/sujet/{id}")
	public Sujet getsubjects(@PathVariable long id){
		return sujetService.getSubject(id).orElseThrow(() -> new RuntimeException("Fail! -> Cause: no subject found with this id."));
		
	}
	
	
	@PostMapping("/api/sujet")
	public Map<String,String> addSubject(@RequestParam(value="titre") String titre,
			@RequestParam(value="contenu") String contenu,
			@RequestParam(value="date") String date,
			@RequestParam(value="user_id") long id) {
				
		Map<String,String> map = new HashMap<String,String>();
			User u = userep.findById(id).orElseThrow(() -> new RuntimeException("Fail! -> Cause: no User found with this id."));
			Sujet sujet = new Sujet(titre,contenu,date,u);
			sujetService.addSubject(sujet);
			map.put("status", "success");
			 map.put("message", "sujet ajouté");
			return map;
		
	}
	
	@PutMapping("/api/sujet/{id}")
	public Map<String,String> updateSubject(@PathVariable long id,@RequestParam(value="titre") String titre,
			@RequestParam(value="contenu") String contenu,
			@RequestParam(value="date") String date,
			@RequestParam(value="user_id") long user_id) {
				
		Map<String,String> map = new HashMap<String,String>();

			Sujet s = sujetService.getSubject(id).orElseThrow(() -> new RuntimeException("Fail! -> Cause: no subject found with this id."));
			s.setTitre(titre);
			s.setContenu(contenu);
			s.setDate(date);
			sujetService.updateSubject(id, s);
			map.put("status", "success");
			 map.put("message", "sujet modifié");
			 	return map;		
	}
	
	@DeleteMapping("/api/sujet/{id}")
	public Map<String,String> deleteSubject(@PathVariable Long id) {
		Map<String,String> map = new HashMap<String,String>();

			
			Iterator<Commentaire> i = sujetService.getSubject(id)
					.get().getCommentaires().iterator();
			
			while(i.hasNext()) {
				Commentaire comcourant = i.next();
				comservice.deleteComment(comcourant.getId());
			}
			sujetService.deleteSubject(id);
			
			map.put("status", "success");
			map.put("message", "sujet supprimé");
			return map;
		
	}
	
	
	
	
	
}
