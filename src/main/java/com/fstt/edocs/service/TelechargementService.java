package com.fstt.edocs.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fstt.edocs.model.Document;
import com.fstt.edocs.model.Telechargement;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.TelechargementRepository;

@Service
public class TelechargementService {

	@Autowired
	public TelechargementRepository telechargementRep;
	
	public void addTelechargement( User user, Document document) {
		Telechargement tel= new Telechargement(user, document);
		telechargementRep.save(tel);
	}
	
	public void updateTelechargement(Telechargement tel) {
		telechargementRep.save(tel);
	}
	
	public void deleteTelechargement(long id) {
		telechargementRep.deleteById(id);
	}
	
	public void getTelechargement(long id) {
		telechargementRep.findById(id).orElseThrow(null);
	}
	
	public List<Telechargement> getAllTelechargment() {
		List<Telechargement> list = new ArrayList<>();
		telechargementRep.findAll().forEach(list::add);
		return list;
	}
	
	//nbr des telechargements qu'un user a effectué
	public int getCountTelechargement(User user) {
		
		return user.getTelechargements().size();

	}
	
	//nbr des telechargements d'un document donné
	public int getCountTelechargement(Document document) {
		return document.getTelechargements().size();
	}
	
	//Liste des DOCUMENTS telechargés par un user
	public List<Document> getUserTelechargements(User user) {
		List<Document> ret = new ArrayList<>();
		for(Telechargement item : user.getTelechargements()) {
			if(!ret.contains(item.getDocument()))ret.add(item.getDocument());
		}
		return ret;
	}
}
