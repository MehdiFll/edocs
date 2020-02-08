package com.fstt.edocs.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fstt.edocs.model.Document;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.UserRepository;
import com.fstt.edocs.service.DocumentService;

@RestController
public class DocumentController {
	@Autowired
	DocumentService documentService;
	@Autowired
	UserRepository userRep;

	@GetMapping("/api/docs/")
	public List<HashMap<String, Object>> alldocs() {
		List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();

		for (int i = 0; i < documentService.getAllDocs().size(); i++) {
			HashMap<String, Object> map = new HashMap<>();
			map.put("id", documentService.getAllDocs().get(i).getId());
			map.put("nom", documentService.getAllDocs().get(i).getNom());
			map.put("description", documentService.getAllDocs().get(i).getDescription());
			map.put("categorie", documentService.getAllDocs().get(i).getCategorie());
			SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map.put("date", sdfDate.format(documentService.getAllDocs().get(i).getDate()));
			map.put("user", documentService.getAllDocs().get(i).getUser().getPrenom() + " "
					+ documentService.getAllDocs().get(i).getUser().getNom());
			map.put("role", documentService.getAllDocs().get(i).getUser().getRoles());
			map.put("user_id", documentService.getAllDocs().get(i).getUser().getId());
			map.put("telechargement", documentService.getAllDocs().get(i).getTelechargements().size());
			list.add(map);
		}
		;
		return list;
	}

	@PostMapping("/api/docs/")
	public Map<String, Object> addDoc(@RequestParam(value = "file") MultipartFile file) {
		String name = StringUtils.cleanPath(file.getOriginalFilename());
		System.out.println(name);
		Document doc = null;
		try {
			User user = userRep.findById((long) 1)
					.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found."));
			doc = new Document(name, "description", "categorie", file.getContentType(), file.getBytes(), user);
			documentService.addDocument(doc);

		} catch (IOException e) {
			e.printStackTrace();
		}

		HashMap<String, Object> map = new HashMap<>();
		map.put("status", "success");
		map.put("message", "document ajouté");
		map.put("id", doc.getId());
		return map;
	}

	@GetMapping("/api/docs/{id}")
	public HashMap<String, Object> getDocument(@PathVariable long id) {
		int i = Integer.parseInt(Long.toString(id));
		HashMap<String, Object> map = new HashMap<>();
		Document doc= documentService.getDoc(id).orElseThrow(() -> new RuntimeException("Fail! -> Cause: Doc not found."));
		map.put("id", doc.getId());
		map.put("nom", doc.getNom());
		map.put("description", doc.getDescription());
		map.put("categorie", doc.getCategorie());
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		map.put("date", sdfDate.format(doc.getDate()));
		map.put("user", doc.getUser().getPrenom() + " "
				+ doc.getUser().getNom());
		map.put("user_id", doc.getUser());
		map.put("telechargement", doc.getTelechargements().size());
		return map;
	}
	
	@GetMapping("/api/docs/user/{id}")
	public Set<Document> getUserDocument(@PathVariable long id) {
		User user = userRep.findById(id)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found."));
		return documentService.getUserDocs(user);
	}

	@PutMapping("/api/docs/{id}")
	public Map<String, String> updateDoc(@PathVariable Long id, @RequestParam(value = "description") String description,
			@RequestParam(value = "categorie") String categorie, @RequestParam(value = "user_id") long user_id) {

		try {
			User user = userRep.findById(user_id)
					.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found."));
			Document doc = documentService.getDoc(id)
					.orElseThrow(() -> new RuntimeException("Fail! -> Cause: no Document found with this id."));

			doc.setDescription(description);
			doc.setCategorie(categorie);
			doc.setUser(user);
			documentService.updateDocument(id, doc);

		} catch (Exception e) {
			e.printStackTrace();
		}

		HashMap<String, String> map = new HashMap<>();
		map.put("status", "success");
		map.put("message", "Document modifié");
		return map;

	}

	@DeleteMapping("/api/docs/{id}")
	public Map<String, String> deleteDocument(@PathVariable Long id) {
		documentService.deleteDocument(id);
		HashMap<String, String> map = new HashMap<>();
		map.put("status", "success");
		map.put("message", "document supprimé");
		return map;
	}

}
