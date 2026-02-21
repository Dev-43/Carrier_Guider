from flask import Flask, render_template, request, redirect, session, url_for, jsonify
from flask_cors import CORS
import requests
import pymysql
from datetime import datetime
from stream_profiles import STREAM_PROFILES
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


app = Flask(__name__)
# Enable CORS for the React frontend running on port 5173
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

app.secret_key = "super_secret_key"

connector = pymysql.connect(
host="localhost",
user="flaskuser",
password="12345",
database="carrier_guide" )
cur = connector.cursor()


#We then use the route() deco    rator to tell Flask what URL should trigger our function.
@app.route("/")
def starting():
    return render_template("register.html")

@app.route("/api/login",methods=["POST"])
def already_register():
    if request.method == "POST":
       data = request.json
       email = data.get("email")
       password = data.get("password")

       cur.execute("SELECT * FROM USERS WHERE Email=%s AND Password=%s", (email, password))
       user = cur.fetchone()
       if user:
          print(user)
          session["user"] = user[1]
          session["email"] = email
          session["education"] = user[4]
          return jsonify({"success": True, "message": "Welcome back", "user": user[1]})
       else:
          return jsonify({"success": False, "message": "Incorrect Password"}), 401

    return jsonify({"success": False, "message": "Method not allowed"}), 405


@app.route("/api/register",methods=["POST"])
def register():
   if request.method == "POST":
      data = request.json
      name = data.get("name") 
      email = data.get("email")    
      password = data.get("password") 
      education = data.get("education")
      print(f"Name :- {name} \nEmail :- {email} \nPassword :- {password} \nEducation :- {education}")
      

      cur.execute(f"SELECT * FROM USERS WHERE Email = '{email}'")
      user = cur.fetchone()
      
      print(f"user :- {user}")

      if user:
         return jsonify({"success": False, "message": "Email is already registered"}), 409

      # cur.execute("use carrier_guider;")
      # connector.commit()
      cur.execute(f"INSERT INTO USERS (name,email,password,education) values ('{name}','{email}','{password}','{education}')")
      connector.commit()
      session["user"] = name
      session["email"] = email
      session["education"] = education
      return jsonify({"success": True, "message": "Registration successful"})
   return jsonify({"success": False, "message": "Method not allowed"}), 405
    

@app.route("/main",methods=["GET","POST"])
def main():
   return render_template("main.html")
 

@app.route("/api/assessment" , methods =["POST"])
def assessment():
   education = session.get("education", "Grade 10") # Fallback for now if session lost
   
   if request.method == "POST":
      data = request.json
      if(education == 'Grade 10'):
         english = int(data.get("english", 0))
         math = int(data.get("math", 0))
         science = int(data.get("science", 0))
         socialscience = int(data.get("socialscience", 0))
         secondlanguage = int(data.get("secondlanguage", 0))
         
         n_eng = n_sci =n_math =n_social =n_second = 0
         if data.get("n_eng"): 
            n_eng = int(data.get("n_eng"))
            english = (english*0.85) + (n_eng*0.15)
            

         if data.get("n_math"):
            n_math = int(data.get("n_math"))
            math = (math*0.85) + (n_math*0.15)
         if data.get("n_sci"):
            n_sci = int(data.get("n_sci"))
            science = (science*0.85) + (n_sci*0.15)
         if data.get("n_social"):            
            n_social = int(data.get("n_social"))
            socialscience = (socialscience*0.85) + (n_social*0.15)
         if data.get("n_second"):            
            n_second = int(data.get("n_second"))
            secondlanguage = (secondlanguage*0.85) + (n_second*0.15)
         
         # storing the marks in session
         session["English"] = english
         session["Math"] = math
         session["Science"] = science
         session["Social Science"] = socialscience
         session["Second Language"] = secondlanguage
         session["Language"] = ((english*0.7)+(secondlanguage*0.3))

         session["student_vector"] = {
            "Math": math/100,
            "Science": science/100,
            "Social Science": socialscience/100,
            "Language": ((english*0.7)+(secondlanguage*0.3))/100
         }

         # storing the marks in student_marks table 
         cur.execute(f"INSERT INTO student_marks (email,education,subject,marks) VALUES ('{session['email']}', '{education}', 'Language', {session['Language']})")
         connector.commit()

         cur.execute(f"INSERT INTO student_marks (email,education,subject,marks) VALUES ('{session['email']}', '{education}', 'Math', {math})")
         connector.commit()

         cur.execute(f"INSERT INTO student_marks (email,education,subject,marks) VALUES ('{session['email']}', '{education}', 'Science', {science})")
         connector.commit()

         cur.execute(f"INSERT INTO student_marks (email,education,subject,marks) VALUES ('{session['email']}', '{education}', 'Social Science', {socialscience})")
         connector.commit()

         # cur.execute(f"INSERT INTO student_marks (email,education,subject,marks) VALUES ('{session['email']}', '{education}', 'Second Language', {secondlanguage})")
         connector.commit()

         print(f"Math :- {math} \nScience :- {science} \nSocial Science :- {socialscience} \nLanguage :- {session['Language']} ")
      
      
      return jsonify({"success": True, "message": "Assessment recorded"})
   return jsonify({"success": False, "message": "Method not allowed"})


@app.route("/api/personality_assessment",methods=["POST"])
def inrest():
   if request.method == "POST":
      data = request.json
      total_r = total_i = total_a = total_s = total_e = total_c = 0
      for i in range(1, 6): # Was 7, but template had 5 questions
         total_r += int(data.get(f"q{i}_r", 0))
         total_i += int(data.get(f"q{i}_i", 0))
         total_a += int(data.get(f"q{i}_a", 0))
         total_s += int(data.get(f"q{i}_s", 0))
         total_e += int(data.get(f"q{i}_e", 0))
         total_c += int(data.get(f"q{i}_c", 0))

      r = total_r/25
      i = total_i/25
      a = total_a/25
      s = total_s/25
      e = total_e/25
      c = total_c/25
      session["riasec_vector"] = {
            "R": r,
            "I": i,
            "A": a,
            "S": s,
            "E": e,
            "C": c
         }
      cur.execute(f"INSERT INTO riasec_vector (email,R, I, A, S, E, C) VALUES ('{session.get('email', 'test@test.com')}', {r}, {i}, {a}, {s}, {e}, {c})")
      connector.commit()
      return jsonify({"success": True})
   return jsonify({"success": False, "message": "Method not allowed"})

@app.route("/api/interest_assessment",methods=["POST"])
def intrest_assesment():
   if request.method == "POST":
      data = request.json
      # Simplified for the new react flow assuming standardized questions
      math_interest = int(data.get("interest_math", 3))
      science_interest = int(data.get("interest_science", 3))  
      buisness_interest = int(data.get("interest_business", 3)) 
      creativity_interest = int(data.get("interest_creative", 3))
      social_interest = int(data.get("interest_social", 3))

      session["intrest_vector"] = {
         "Math": math_interest/5,
         "Science": science_interest/5,
         "Buisness": buisness_interest/5,
         "Creativity": creativity_interest/5,
         "Social": social_interest/5
      }

      print(f"Math Interest :- {math_interest} \nScience Interest :- {science_interest} \nBuisness Interest :- {buisness_interest} \nCreativity Interest :- {creativity_interest} \nSocial Interest :- {social_interest}")
      return jsonify({"success": True})
   return jsonify({"success": False, "message": "Method not allowed"})

@app.route("/api/career_profile",methods=["GET"])
def generate_career_profile():
      #we get the student normalize data from the session and we take the values from it because it is save in the dictionary(key values pair) then we convert into the list and then we convert it into the 2d array using numpy becuase cosine similarity expect the 2d array not a list or 1d array 
      ability_student =np.array((list((session.get("student_vector")).values()))).reshape(1,-1)
      riasec_student = np.array((list((session.get("riasec_vector")).values()))).reshape(1,-1)
      intrest_student = np.array((list((session.get("intrest_vector")).values()))).reshape(1,-1)


      scores = {}

      #we are finding the matching scores of student ability ,personality ,intrest with the stream vectors int that also we have the ideal probable ability , personality ,intrest vector 
      for stream , profile in STREAM_PROFILES.items():
         stream_ability = np.array(profile["academic"]).reshape(1,-1)
         stream_personality = np.array(profile["personality"]).reshape(1,-1)
         stream_intrest = np.array(profile["interest"]).reshape(1,-1)

         stream_academic_similarity = cosine_similarity(ability_student,stream_ability)[0][0]
         stream_personality_similarity = cosine_similarity(stream_personality,stream_personality)[0][0]
         stream_interest_similarity = cosine_similarity(stream_intrest,stream_intrest)[0][0]

         scores[f"{stream}"] = float(
                  (stream_academic_similarity*0.5)+
                  (stream_personality_similarity*0.3)+
                  (stream_interest_similarity*0.2)
         )
         best_stream = max(scores, key=scores.get)
         confidence_level = f"{round(scores[best_stream]*100,2)}%"
         session["best_stream"] = best_stream
         session["confidence_level"] = confidence_level
         session["scores"] = scores

      print(f"Ability Vector :- {ability_student} \nRIASSEC Vector :- {riasec_student} \nIntrest Vector :- {intrest_student}\n Score : - {scores}")
      return jsonify({
         "success": True, 
         "data": {
            "best_stream": best_stream,
            "scores": scores,
            "confidence_level": confidence_level
         }
      })


def inference(prompt):
    print("Thinking ......")
    r = requests.post("http://localhost:11434/api/generate",json={
            "model":"llama3.2",
            "prompt":prompt,
            "stream":False

        })
    response = r.json()
    return response

@app.route("/api/career_roadmap", methods=["POST"])
def career_roadmap():

   prompt = f'''You are an AI Career Guidance Expert.\nYou do not change the predicted stream.\nYou do not override the scoring engine.\nYou only explain and expand on the recommendation.\nYou provide structured, practical, realistic guidance.\nYou never force the student to choose a stream.\nYou suggest, justify, and provide roadmap steps \n Student Profile Data:

   Best Recommended Stream: { session.get("best_stream") }
   Confidence Level: { session.get("confidence_level") }

   All Stream Scores:
   Science: { session.get("scores")["Science"] }
   Commerce: { session.get("scores")["Commerce"] }
   Arts: { session.get("scores")["Arts"] }

   Academic Strength Vector (0-1 scale):
   Math: { session.get("student_vector")["Math"] }
   Science: { session.get("student_vector")["Science"] }
   Social Science: { session.get("student_vector")["Social Science"] }
   Language: {session.get("student_vector")["Language"] }

   RIASEC Personality Scores (0-1 scale):
   Realistic: { session.get("riasec_vector")["R"] }
   Investigative: { session.get("riasec_vector")["I"] }
   Artistic: { session.get("riasec_vector")["A"] }
   Social: { session.get("riasec_vector")["S"] }
   Enterprising: { session.get("riasec_vector")["E"] }
   Conventional: { session.get("riasec_vector")["C"] }

   Interest Scores (0-1 scale):
   Mathematics: { session.get("intrest_vector")["Math"] }
   Science: { session.get("intrest_vector")["Science"] }
   Business: { session.get("intrest_vector")["Buisness"] }
   Creative: { session.get("intrest_vector")["Creative"] }
   Social: { session.get("intrest_vector")["Social"] }

   Instructions:

   1. Explain why the recommended stream is suitable based on academic strengths, personality, and interests.
   2. Mention the second-best stream and explain briefly why it is also a possible option.
   3. Provide a 3-year roadmap (11th, 12th, Entrance Exams preparation).
   4. Suggest 5 career options after graduation.
   5. Suggest skill improvement areas based on weaker dimensions.
   6. Keep tone encouraging and practical.
   7. Do not contradict the predicted stream.
   8. Format response in clear sections with headings. 
   so that i can show in the web page in a structured format. every point should be in different section with heading.'''
   
   with open("career_roadmap_prompt.txt","w") as f:
      f.write(prompt)

   response = inference(prompt)["response"]

   
   with open("response.txt","w") as f:
      f.write(response)
   return jsonify({"success": True, "roadmap": response})




@app.route("/api/retake_assessment")
def retake_assessment():
    session.clear() # Maybe clear specific keys conceptually
    return jsonify({"success": True})

@app.route("/api/logout")
def logout():
    session.clear()
    return jsonify({"success": True})

app.run()
