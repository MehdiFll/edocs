package com.fstt.edocs.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fstt.edocs.model.Agenda;
import com.fstt.edocs.model.User;
import com.fstt.edocs.repository.AgendaRepository;

@Service
public class AgendaService {

	@Autowired
	AgendaRepository agendaRep;
	
	public List<Agenda> getAllAgenda(){
		List<Agenda> list = new ArrayList<>();
		agendaRep.findAll().forEach(list::add);
		return list;
	}
	
	public List<Agenda> getUserAgenda(User user){
		List<Agenda> ret = new ArrayList<>();
		for(Agenda item : user.getAgendas()) {
			ret.add(item);
		}
		return ret;
	}
	
	public String updateAgenda(Agenda agenda) {
		agendaRep.save(agenda);
		return "success";
	}
	
	public void addAgenda(Agenda agenda) {
		agendaRep.save(agenda);
	}
	
	public void deleteAgenda(Agenda agenda) {
		agendaRep.delete(agenda);
	}
	
	public Agenda getAgenda(long id) {
		return agendaRep.findById(id).orElseThrow(null);
	}
}
