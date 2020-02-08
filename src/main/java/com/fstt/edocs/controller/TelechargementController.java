package com.fstt.edocs.controller;

import java.util.List;

import javax.annotation.security.PermitAll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.fstt.edocs.model.Document;
import com.fstt.edocs.model.Telechargement;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.UserRepository;
import com.fstt.edocs.service.DocumentService;
import com.fstt.edocs.service.TelechargementService;

@RestController
public class TelechargementController {

	@Autowired
	TelechargementService telechargementService;
	
	@Autowired
    DocumentService documentService;

	@Autowired
	UserRepository userRep;
	
	@GetMapping("/api/telechargement/")
	public List<Telechargement> allTelechargement() {
		return telechargementService.getAllTelechargment();
	}
	
	@GetMapping("/api/telechargement/user/{id}")
	public List<Document> getUserTelechargement(@PathVariable long id) {
		User user = userRep.findById(id)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found."));
		return telechargementService.getUserTelechargements(user);
				
	}
	
	
	//add telechargement sera automatiquement avec bouton telecharger
	//pour telecharger uniquement le fichier
	
	@GetMapping("/api/telechargement/telecharger/{fileId}/{userId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId, @PathVariable long userId) {
		
		User user = userRep.findById(userId)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: no User found with this id."));
		
		// Load file from database
        Document document= documentService.getDoc(fileId)
        		.orElseThrow(() -> new RuntimeException("Fail! -> Cause: no Document found with this id."));
        
        telechargementService.addTelechargement(user, document);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getNom() + "\"")
                .body(new ByteArrayResource(document.getContenu()));
        
	}
	@CrossOrigin()
	@GetMapping("/api/telechargement/visualiser/{fileId}")
    public ResponseEntity<Resource> showFile(@PathVariable Long fileId) {
		
		
		// Load file from database
        Document document= documentService.getDoc(fileId)
        		.orElseThrow(() -> new RuntimeException("Fail! -> Cause: no Document found with this id."));
        
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getNom() + "\"")
                .body(new ByteArrayResource(document.getContenu()));
        
	}
	
	@GetMapping("/api/telechargement/usercount/{userId}")
	public int getUserCount(@PathVariable long userId) {
		User user = userRep.findById(userId)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: no User found with this id."));
		return telechargementService.getCountTelechargement(user);	
	}
	
	@GetMapping("/api/telechargement/documentcount/{fileId}")
	public int getDocumentCount(@PathVariable Long fileId) {
		
		Document document = documentService.getDoc(fileId)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: no User found with this id."));
		return telechargementService.getCountTelechargement(document);	
	}
}
