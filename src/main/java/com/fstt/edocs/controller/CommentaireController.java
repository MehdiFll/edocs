package com.fstt.edocs.controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

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
public class CommentaireController {

	
	@Autowired 
	UserRepository userep;
	
	@Autowired
	CommentaireService comservice;
	
	@Autowired
	SujetService sujetservice;
	
	
	@GetMapping("api/commentaires/{sujet_id}")
	public Set<Commentaire> getAllComsOfSubject(@PathVariable Long sujet_id){
		
	Sujet sujet = sujetservice.getSubject(sujet_id).orElseThrow(() ->new RuntimeException("Fail! -> Cause: subject not found."));
	return sujet.getCommentaires();
		
	}
	
	
	@PostMapping("api/commentaires/{sujet_id}")
	public Map<String,String> addCom(@PathVariable Long sujet_id,@RequestParam(value="contenu") String contenu,
						@RequestParam(value="user_id") long id,
						@RequestParam(value="date") String date) {
		 Map<String, String> map = new HashMap<String, String>();
		User u = userep.findById(id).orElseThrow(() ->new RuntimeException("Fail! -> Cause: user not found."));
		Sujet s = sujetservice.getSubject(sujet_id).orElseThrow(() ->new RuntimeException("Fail! -> Cause: subject not found."));
		Commentaire com = new Commentaire(contenu,u,s,date);
		comservice.addComment(com);
		 map.put("status", "success");
		 map.put("message", "commentaire ajouté");
		return map;
		
	}
	
	@GetMapping("api/commentaires/{sujet_id}/{com_id}")
	public Commentaire getCom(@PathVariable Long sujet_id,
							@PathVariable Long com_id){
		Sujet sujet =sujetservice.getSubject(sujet_id).orElseThrow(() ->new RuntimeException("Fail! -> Cause: sujet not found."));
		Set<Commentaire> listCom = sujet.getCommentaires();
		Iterator<Commentaire> i = listCom.iterator();
		boolean found = false;
		Commentaire com=null;
		while(i.hasNext()) {
			Commentaire comcourant = i.next();
			if(comcourant.getId()==com_id) {
				found = true;
				com=comcourant;
			}
		}
		if(found) {
			return com ;
		}
		else {
			throw(new RuntimeException("Fail! -> Cause: sujet doesnt have that comment"));
		}
		
	}
	
	@PutMapping("api/commentaires/{sujet_id}/{com_id}")
	public Map<String,String> updateCom(@PathVariable Long sujet_id,
							@PathVariable Long com_id,@RequestParam(value="contenu") String contenu){
		 Map<String, String> map = new HashMap<String, String>();
		Commentaire com = comservice.getComment(com_id).orElseThrow(() ->new RuntimeException("Fail! -> Cause: comment not found."));
		com.setContenu(contenu);
		comservice.updateComment(com_id, com);
		 map.put("status", "success");
		 map.put("message", "commentaire modifié");
		return map;
		
	}
	
	@DeleteMapping("api/commentaires/{sujet_id}/{com_id}")
	public Map<String,String> deleteCom(@PathVariable Long sujet_id,
							@PathVariable Long com_id) {
		 Map<String, String> map = new HashMap<String, String>();
		Sujet sujet =sujetservice.getSubject(sujet_id).orElseThrow(() ->new RuntimeException("Fail! -> Cause: sujet not found."));
		Set<Commentaire> listCom = sujet.getCommentaires();
		Iterator<Commentaire> i = listCom.iterator();
		boolean found = false;
		while(i.hasNext()) {
			Commentaire comcourant = i.next();
			if(comcourant.getId()==com_id) {
				found = true;
				break;
			}
		}
		if(found) {
			map.put("status", "success");
			map.put("message", "commentaire supprimé");
		}
		else {
			throw(new RuntimeException("Fail! -> Cause: sujet doesnt have that comment"));
		}
		
		return map;
	}
	
	@GetMapping("api/commentaires/user/{user_id}")
	 public Set<Commentaire> getUserCom(@PathVariable long user_id) {
	    	return userep.findById(user_id).orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found.")).getCommentaires();
	    }
	    
}
