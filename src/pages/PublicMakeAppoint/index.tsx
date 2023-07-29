import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { isToday, format, parseISO, isAfter, isBefore } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import DayPicker, { DayModifiers }  from "react-day-picker";
import "react-day-picker/lib/style.css";
import Input from "../../components/Input";

import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import Button from "../../components/Button";

import { FiClock, FiPower } from "react-icons/fi";
import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    NextAppointment,
    Section,
    Calendar
} from "./styles";

//import logo from "../../assets/logo.svg";

import { useAuth } from "../../hooks/auth";
import api from "../../services/api";

interface AppointmentFormData{
    provider_id: string;
    date: string;
}

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
  }

var user_id: '4a506a17-130e-4211-908b-6cdbb510c83c';
var user_name: 'Manager PDV';


interface Appointments {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
      name: string;
      avatar_url: string;
    };
  }

const PublicMakeAppoint: React.FC = () => {

    const formRef = useRef<FormHandles>(null);
    const history = useHistory();
    const handleSubmit = useCallback(
        async (data: AppointmentFormData) => {
          try {

            await api.post("appointments_public", data);

            alert("Agendado com sucesso");

            //history.push("/make_appoint");
            history.go(0);

        } catch (err) {
            //setLoading(false);

            alert("Ocorreu um erro");

          }
        },
        [history],
      );

    const { signOut } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [appointments, setAppointments] = useState<Appointments[]>([]);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available && !modifiers.disabled) {
          setSelectedDate(day);
        }
      }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api
          .get(`/providers/${user_id}/month-availability`, {
            params: {
              year: currentMonth.getFullYear(),
              month: currentMonth.getMonth() + 1,
            },
          })
          .then(response => {
            setMonthAvailability(response.data);
          });
      }, [currentMonth]);

    useEffect(() => {
        api
          .get<Appointments[]>("/appointments_public/me", {
            params: {
              year: selectedDate.getFullYear(),
              month: selectedDate.getMonth() + 1,
              day: selectedDate.getDate(),
            },
          })
          .then(response => {
            const appointmentsFormatted = response.data.map(appointment => {
                return {
                  ...appointment,
                  hourFormatted: format(parseISO(appointment.date), "HH:mm"),
                };
              });
            setAppointments(appointmentsFormatted);
          });
      }, [selectedDate]);

      const disabledDays = useMemo(() => {
        const dates = monthAvailability
          .filter(monthDay => monthDay.available === false)
          .map(monthDay => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();

            return new Date(year, month, monthDay.day);
          });

        return dates;
      }, [currentMonth, monthAvailability]);

      const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
          locale: ptBR,
        });
      }, [selectedDate]);

      const selectedWeekDay = useMemo(() => {
        return format(selectedDate, "cccc", {
          locale: ptBR,
        });
      }, [selectedDate]);

      const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
          return parseISO(appointment.date).getHours() < 12;
        });
      }, [appointments]);

      const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
          return parseISO(appointment.date).getHours() >= 12;
        });
      }, [appointments]);

      const nextAppointment = useMemo(() => {
        return appointments.find(appointment =>
          isAfter(parseISO(appointment.date), new Date()),
        );
      }, [appointments]);

      const selectedDateAsSql = useMemo(() => {
        return format(selectedDate, "yyyy-MM-dd", {
          locale: ptBR,
        });
      }, [selectedDate]);

    return(
    <Container>
        <Header>
         <HeaderContent>
          <img src={'https://fgfinfonet.com.br/marinaldo/assets/img/login_logo.png'} alt="Manager PDV" />

          <Profile>
            <img src={'https://fgfmanager.com.br/fgfmanager/assets/img/icons/settings.png'} alt={'Manager PDV'} />

            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>{user_name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
            <h1>Horários</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
                <strong>Manhã</strong>
                {isToday(selectedDate) && (
                <p>Nenhum horário disponível</p>
            )}

                {isBefore(selectedDate, new Date()) && (
                <p>Nenhum horário disponível</p>
            )}

                {morningAppointments.length === 0 && !isToday(selectedDate) && !isBefore(selectedDate, new Date()) && (
           <>
        <Form ref={formRef} onSubmit={ handleSubmit }>
        <Input
              name="date"
              type="hidden"
              placeholder="date"
              value={selectedDateAsSql+" 09:00"}
            />
        <Input
              name="provider_id"
              type="hidden"
              placeholder="provider_id"
              value={'532749bb-bec8-4b58-873b-36f2d69a5258'}
            />
        <Button type="submit">Agendar 09:00 horas</Button>
        </Form>

        <Form ref={formRef} onSubmit={ handleSubmit }>
        <Input
              name="date"
              type="hidden"
              placeholder="date"
              value={selectedDateAsSql+" 10:00"}
            />
        <Input
              name="provider_id"
              type="hidden"
              placeholder="provider_id"
              value={'532749bb-bec8-4b58-873b-36f2d69a5258'}
            />
        <Button type="submit">Agendar 10:00 horas</Button>
        </Form>

        <Form ref={formRef} onSubmit={ handleSubmit }>
        <Input
              name="date"
              type="hidden"
              placeholder="date"
              value={selectedDateAsSql+" 11:00"}
            />
        <Input
              name="provider_id"
              type="hidden"
              placeholder="provider_id"
              value={'532749bb-bec8-4b58-873b-36f2d69a5258'}
            />
        <Button type="submit">Agendar 11:00 horas</Button>
        </Form>

           </>
            )}


                {morningAppointments.map(appointment => (
              /*<Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>*/
              <p>Nenhum horário disponível</p>
            ))}
          </Section>

          <Section>
                <strong>Tarde</strong>

                {isToday(selectedDate) && (
                <p>Nenhum horário disponível</p>
            )}

{isBefore(selectedDate, new Date()) && (
                <p>Nenhum horário disponível</p>
            )}

                {afternoonAppointments.length === 0 && !isToday(selectedDate) && !isBefore(selectedDate, new Date()) && (
           <>

        <Form ref={formRef} onSubmit={ handleSubmit }>
        <Input
              name="date"
              type="hidden"
              placeholder="date"
              value={selectedDateAsSql+" 14:00"}
            />
        <Input
              name="provider_id"
              type="hidden"
              placeholder="provider_id"
              value={'532749bb-bec8-4b58-873b-36f2d69a5258'}
            />
        <Button type="submit">Agendar 14:00 horas</Button>
        </Form>

        <Form ref={formRef} onSubmit={ handleSubmit }>
        <Input
              name="date"
              type="hidden"
              placeholder="date"
              value={selectedDateAsSql+" 16:00"}
            />
        <Input
              name="provider_id"
              type="hidden"
              placeholder="provider_id"
              value={'532749bb-bec8-4b58-873b-36f2d69a5258'}
            />
        <Button type="submit">Agendar 16:00 horas</Button>
        </Form>

        <Form ref={formRef} onSubmit={ handleSubmit }>
        <Input
              name="date"
              type="hidden"
              placeholder="date"
              value={selectedDateAsSql+" 17:00"}
            />
        <Input
              name="provider_id"
              type="hidden"
              placeholder="provider_id"
              value={'532749bb-bec8-4b58-873b-36f2d69a5258'}
            />
        <Button type="submit">Agendar 17:00 horas</Button>
        </Form>

           </>
            )}

                {afternoonAppointments.map(appointment => (
              /*<Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>*/
              <p>Nenhum horário disponível</p>
            ))}
          </Section>

        </Schedule>

            <Calendar>
                <DayPicker
                    weekdaysShort={["D", "S", "T", "Q", "Q", "S", "S"]}
                    fromMonth={new Date()}
                    disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                    modifiers={{
                        available: { daysOfWeek: [1, 2, 3, 4, 5] },
                      }}
                    onMonthChange={handleMonthChange}
                    selectedDays={selectedDate}
                    onDayClick={handleDateChange}
                    months={[
                        "Janeiro",
                        "Fevereiro",
                        "Março",
                        "Abril",
                        "Maio",
                        "Junho",
                        "Julho",
                        "Agosto",
                        "Setembro",
                        "Outubro",
                        "Novembro",
                        "Dezembro",
                      ]}

                />
            </Calendar>
      </Content>

    </Container>
);
};

export default PublicMakeAppoint;

