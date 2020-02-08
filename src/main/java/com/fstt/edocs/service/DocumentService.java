package com.fstt.edocs.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fstt.edocs.model.Document;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.DocumentRepository;
import com.fstt.edocs.repository.UserRepository;

@Service
public class DocumentService {
	
	@Autowired
	public DocumentRepository docrepos;
	
	@Autowired
	public UserRepository userRep;
		
	public List<Document> getAllDocs(){
		List<Document> docs = new ArrayList<>();
		docrepos.findAll().forEach(docs::add);
		return docs;
	}
	
	public Set<Document> getUserDocs(User user){
		
		
		return user.getDocument();
	}
	
	public Optional<Document> getDoc(long id) {
		return docrepos.findById(id);
	}
	
	public void addDocument(Document document) {
		docrepos.save(document);
	}
	
	public void updateDocument(long id,Document document) {
		docrepos.save(document);
	}
	
	public void deleteDocument(long id) {
	    docrepos.deleteById(id);
	}
}
