/*************************************************************************
 * Educational Online Test Delivery System Copyright (c) 2017 American
 * Institutes for Research
 *
 * Distributed under the AIR Open Source License, Version 1.0 See accompanying
 * file AIR-License-1_0.txt or at
 * http://www.smarterapp.org/documents/American_Institutes_for_Research_Open_Source_Software_License.pdf
 *************************************************************************/
package irt.report.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.QueryParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import irt.report.mongo.dao.ReportDAO;
import irt.report.mongo.model.BrowserTestResult;

@Controller
@RequestMapping ("/report")
public class ReportController
{

  @Autowired
  private ReportDAO reportDAO;

  @RequestMapping (value = "/getReport/{reportId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
  @ResponseBody
  public Object getReport (HttpServletRequest request,
      HttpServletResponse response, @PathVariable ("reportId") Long reportId) throws Exception {

    Map<String, Object> returnMap = new LinkedHashMap<String, Object> ();

    BrowserTestResult browserTestResult = reportDAO.getResultByReportId (reportId);

    if (browserTestResult == null) {
      returnMap.put ("success", false);
      returnMap.put ("message", "No report found for the requested ID " + reportId);
    } else {
      returnMap.put ("success", true);
      returnMap.put ("reportData", browserTestResult);

    }
    return returnMap;

  }

  @RequestMapping (value = "/saveReport", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
  @ResponseBody
  public Object saveReport (HttpServletRequest request,
      HttpServletResponse response, @QueryParam ("reportJsonData") String reportJsonData) throws Exception {

    Map<String, Object> returnMap = new LinkedHashMap<String, Object> ();

    Long reportId = reportDAO.insertResult (reportJsonData);

    returnMap.put ("success", true);
    returnMap.put ("reportId", reportId);
    return returnMap;

  }

}
