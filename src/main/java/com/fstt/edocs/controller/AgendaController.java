package com.fstt.edocs.controller;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fstt.edocs.model.Agenda;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.UserRepository;
import com.fstt.edocs.service.AgendaService;

@RestController
public class AgendaController {

	@Autowired
	AgendaService agendaService;
	
	@Autowired
	UserRepository userRep;
	
	
	@GetMapping("/api/agenda/")
	public List<Agenda> allAgenda() {
		return agendaService.getAllAgenda();
	}
	
	@GetMapping("/api/agenda/user/{id}")
	public List<HashMap<String, Object>> userAgenda(@PathVariable long id) {
		User user = userRep.findById(id)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found."));
		
		
		
		List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();

		for (int i = 0; i < agendaService.getUserAgenda(user).size(); i++) {
			HashMap<String, Object> map = new HashMap<>();
			map.put("id", agendaService.getUserAgenda(user).get(i).getId());
			map.put("title", agendaService.getUserAgenda(user).get(i).getTitle());
			
			SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			map.put("start", sdfDate.format(agendaService.getUserAgenda(user).get(i).getStart()));
			map.put("end", sdfDate.format(agendaService.getUserAgenda(user).get(i).getend()));
			
			list.add(map);
		}
		;
		return list;
	}
	
	@PostMapping("/api/agenda/")
	public Map<String,String> addAgenda(
			@RequestParam(value = "nom") String nom,
			@RequestParam(value = "date_debut")  String date_debut ,
			@RequestParam(value = "date_fin") String date_fin ,
			@RequestParam(value = "user_id") long id) {
			
		User user = userRep.findById(id)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found."));
		
		try {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

			Date debut = simpleDateFormat.parse(date_debut);
			Date fin = simpleDateFormat.parse(date_fin);
			Agenda agenda = new Agenda(nom,debut,fin, user);
			agendaService.addAgenda(agenda);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		HashMap<String, String> map = new HashMap<>();
	    map.put("status", "success");
		return map;
	}
	
	@PutMapping("/api/agenda/{id}")
	public Map<String,String> updateAgenda(@PathVariable Long id, @RequestParam(value = "nom") String nom,
			@RequestParam(value = "date_debut") String date_debut ,@RequestParam(value = "date_fin") String date_fin ,
			@RequestParam(value = "style") String style,
			@RequestParam(value = "user_id") long userId) {
			
		User user = userRep.findById(userId)
				.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User not found."));
		Agenda agenda = agendaService.getAgenda(id);
		try {
			Date debut = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date_debut);
			Date fin = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date_fin);
			agenda.setStart(debut);
			agenda.setEnd(fin);
			
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		agenda.setTitle(nom);
		
		agenda.setUser(user);
		agendaService.updateAgenda(agenda);
		HashMap<String, String> map = new HashMap<>();
	    map.put("status", "success");
		return map;
		
	}
	
	@DeleteMapping("/api/agenda/{id}")
	public Map<String,String> deleteAgenda(@PathVariable Long id) {
		Agenda agenda = agendaService.getAgenda(id);
		agendaService.deleteAgenda(agenda);
		HashMap<String, String> map = new HashMap<>();
	    map.put("status", "success");
		return map;
	}

}
